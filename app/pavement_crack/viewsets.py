from rest_framework import status
from rest_framework.decorators import action
import requests
import json
from rest_framework import viewsets
from rest_framework.response import Response
from django.db import connection
from django.http import JsonResponse


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

        res = []
        with connection.cursor() as cursor:
            query = "SELECT * FROM pavement_crack_pavementcrack "
            if conditions:
                query += " WHERE " + " AND ".join(conditions)

            cursor.execute(query, parameters)

            rows = cursor.fetchall()
            for row in rows:
                res.append({
                    'id': row[0],
                    'lat': row[1],
                    'long': row[2],
                    'timestamp': row[3],
                    'status': row[4],
                    'inspection_date': row[5],
                    'repair_date': row[6],
                    'repair_type': row[7],
                    'd00': row[8],
                    'd10': row[9],
                    'd20': row[10],
                    'd40': row[11],
                    'image': row[13],
                })

        return JsonResponse({'data': res})

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
