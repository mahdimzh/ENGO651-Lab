from rest_framework import status
from rest_framework.decorators import action
import requests
import json
from rest_framework import viewsets
from rest_framework.response import Response
from django.db import connection
from django.http import JsonResponse
import geopandas as gpd
from shapely.geometry import Point
from pyomo.environ import *
import numpy as np
import pandas as pd

# ignore warnings
import warnings
warnings.filterwarnings('ignore')


class PavementCrackViewSet(viewsets.ModelViewSet):

    @action(detail=False)
    def get_pavement_cracks(self, request):
        filters = self.request.query_params.get('filter', '')
        if filters != None and filters != '':
            filters = json.loads(filters)
            startDate = filters['issueDateStart']
            endDate = filters['issueDateEnd']
            d00 = filters['d00']
            d10 = filters['d10']
            d20 = filters['d20']
            d40 = filters['d40']

        # queryset = self.get_queryset().filter(title__contains=title_term).filter(isbn__contains=isbn_term).filter(author__contains=author_term)
        # serializer = self.serializer_class(queryset, many=True)
        # return Response(serializer.data)
        filter = {}
        conditions = []
        parameters = []

        if d00 is True:
            filter["d00"] = True
            conditions.append("d00 > %s")
            parameters.append(0)

        if d10 is True:
            filter["d10"] = True
            conditions.append("d10 > %s")
            parameters.append(0)

        if d20 is True:
            filter["d20"] = True
            conditions.append("d20 > %s")
            parameters.append(0)

        if d40 is True:
            filter["d40"] = True
            conditions.append("d40 > %s")
            parameters.append(0)

        if startDate:
            conditions.append("timestamp >= %s")
            parameters.append(startDate)

        if endDate:
            conditions.append("timestamp <= %s")
            parameters.append(endDate)

        res = []
        # with connection.cursor() as cursor:
        #     query = "SELECT * FROM pavement_crack_pavementcrack "
        #     if conditions:
        #         query += " WHERE " + " AND ".join(conditions)

        #     cursor.execute(query, parameters)

        #     rows = cursor.fetchall()
        #     for row in rows:
        #         res.append({
        #             'id': row[0],
        #             'lat': row[1],
        #             'long': row[2],
        #             'timestamp': row[3],
        #             'status': row[4],
        #             'inspection_date': row[5],
        #             'repair_date': row[6],
        #             'repair_type': row[7],
        #             'd00': row[8],
        #             'd10': row[9],
        #             'd20': row[10],
        #             'd40': row[11],
        #             'image': row[13],
        #         })

        uri = 'https://deep-pave-0a514df89d9a.herokuapp.com/api/retrieve-data'
        # uri = 'https://deep-pave-0a514df89d9a.herokuapp.com/api/retrieve-data-filter'
        # uri += "?filter=" + json.dumps(filter)

        res = requests.get(uri)

        return JsonResponse(res.json())

    @action(detail=False)
    def get_reports(self, request):
        filters = self.request.query_params.get('filter', '')
        if filters != None and filters != '':
            filters = json.loads(filters)
            startDate = filters['issueDateStart']
            endDate = filters['issueDateEnd']
            d00 = filters['d00']
            d10 = filters['d10']
            d20 = filters['d20']
            d40 = filters['d40']

        # queryset = self.get_queryset().filter(title__contains=title_term).filter(isbn__contains=isbn_term).filter(author__contains=author_term)
        # serializer = self.serializer_class(queryset, many=True)
        # return Response(serializer.data)

        group_by_status = []
        group_by_repair_type = []
        request_per_day = []
        conditions = []
        parameters = []

        if d00 is True:
            conditions.append("d00 > %s")
            parameters.append(0)

        if d10 is True:
            conditions.append("d10 > %s")
            parameters.append(0)

        if d20 is True:
            conditions.append("d20 > %s")
            parameters.append(0)

        if d40 is True:
            conditions.append("d40 > %s")
            parameters.append(0)

        if startDate:
            conditions.append("timestamp >= %s")
            parameters.append(startDate)

        if endDate:
            conditions.append("timestamp <= %s")
            parameters.append(endDate)

        with connection.cursor() as cursor:
            # Query1
            query = "SELECT status, COUNT(*) FROM pavement_crack_pavementcrack "
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            query += " GROUP BY status"

            if parameters:
                cursor.execute(query, parameters)
            else:
                cursor.execute(query)
            rows = cursor.fetchall()
            for row in rows:
                group_by_status.append({
                    'status': row[0],
                    'count': row[1],
                })

            # Query2
            query = "SELECT repair_type, COUNT(*) FROM pavement_crack_pavementcrack "
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            query += " GROUP BY repair_type"

            if parameters:
                cursor.execute(query, parameters)
            else:
                cursor.execute(query)
            rows = cursor.fetchall()
            for row in rows:
                group_by_repair_type.append({
                    'repair_type': row[0],
                    'count': row[1],
                })

            # Query3
            query = "SELECT DATE_FORMAT(timestamp, '%%Y-%%m-%%d'), COUNT(*) FROM pavement_crack_pavementcrack "
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            query += " GROUP BY DATE_FORMAT(timestamp, '%%Y-%%m-%%d')"

            if parameters:
                cursor.execute(query, parameters)
            else:
                cursor.execute(query)
            rows = cursor.fetchall()
            for row in rows:
                request_per_day.append({
                    'date': row[0],
                    'count': row[1],
                })

        res = {
            'group_by_status': group_by_status,
            'group_by_repair_type': group_by_repair_type,
            'request_per_day': request_per_day,
        }

        return JsonResponse({'data': res})

    @action(detail=False)
    def get_planning(self, request):
        try:
            filters = self.request.query_params.get('filter', '')
            if filters != None and filters != '':
                filters = json.loads(filters)
                budget = filters['budget']
                pavement_cost = filters['pavement_cost']
                points_payevemnt = filters['points_payevemnt']

            points_df = pd.DataFrame(points_payevemnt, columns=['lat', 'lon'])

            # *****************************************read the shapefile (adjust the path to the shapefile)**********************
            shp = gpd.read_file(
                "app/pavement_crack/data/grids/calgary_grids.shp")

            # create a geodataframe of the random points
            gdf = gpd.GeoDataFrame(points_df, geometry=[Point(
                x, y) for x, y in zip(points_df.lon, points_df.lat)])
            # spatial join
            join_dfs = gpd.sjoin(gdf, shp, op='within')

            # pivot the table to get the count of points in each grid cell
            pivot = join_dfs.pivot_table(index='id', aggfunc='size')

            # get the polygon of each grid cell from join_dfs
            polygons = join_dfs[['id', 'geometry']
                                ].drop_duplicates(subset='id')

            # get the id in pivot as Number of geographical regions
            N = len(pivot)

            # get the count of points in each grid cell as Initial distribution of pavement repairs
            pavement_distribution = pivot.values.tolist()

            # Number of Pavement types
            M = len(pavement_cost)

            # Create a ConcreteModel
            model = ConcreteModel()

            # Define variables
            # Binary variable for repairing each pavement type in each region
            model.x = Var(range(N), range(M), domain=Binary)

            # Define objective function
            model.obj = Objective(
                expr=sum(model.x[n, m] for n in range(N) for m in range(M)), sense=maximize)

            # Constraints

            # Budget constraint
            model.budget_constraint = Constraint(expr=sum(
                pavement_cost[m] * pavement_distribution[n] * model.x[n, m] for n in range(N) for m in range(M)) <= budget)

            # Solve the model
            # check if glpk solver is not installed
            solver_result = SolverFactory('glpk').solve(model)

            # Check the solver status
            if solver_result.solver.status == SolverStatus.ok:
                if solver_result.solver.termination_condition == TerminationCondition.optimal:
                    print(
                        "Solver terminated successfully and found an optimal solution.")
                else:
                    print(
                        "Solver terminated successfully but did not find an optimal solution.")
            elif solver_result.solver.status == SolverStatus.warning:
                print("Solver encountered a warning.")
            else:
                print("Solver encountered an error.")

            # get equvalent piviot id that coresponds to N
            pivot_id = pivot.index.tolist()

            # return selected pavement types in each region as a list with its index and overal regions in a dictionary along with total cost
            pavement_type = {}
            for n in range(N):
                region_repairs = []
                # get the id of the grid cell
                id = pivot_id[n]
                for m in range(M):
                    if model.x[n, m].value == 1:
                        region_repairs.append(m)
                pavement_type[id] = region_repairs
            # return the results

            return JsonResponse({'pavement_type': pavement_type, 'total_cost': sum(pavement_cost[m] * model.x[n, m].value for n in range(N) for m in range(M)), 'polygons': {}})
        except:
            return JsonResponse({'data': {}})
