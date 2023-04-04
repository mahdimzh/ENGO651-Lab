from rest_framework import status
from rest_framework.decorators import action
import json
from rest_framework import viewsets
from rest_framework.response import Response
from route_recommendation.pathFinder import PathFinder
import sys

from pathlib import Path

class RouteRecommendationViewSet(viewsets.ModelViewSet):

    path_file = Path(sys.path[0])
    graph_file = str(path_file) + '/route_recommendation' + '/data/calgary_graph_network.graphml'

    path_finder = PathFinder(graph_file)

    # path_finder = None
    # @action(detail=False)
    # def loadGraph(self, request):
    #     if(self.path_finder is None):
    #         path_file = Path(sys.path[0])
    #         graph_file = str(path_file) + '/route_recommendation' + '/data/calgary_drive_network_updated.graphml'

    #         self.path_finder = PathFinder(graph_file)

    @action(detail=False)
    def getRoute(self, request):
        filters = request.query_params.get('filter', '')
        if filters != None and filters != '':
            filters = json.loads(filters)
            distanceWeight = filters['distanceWeight']
            weatherWeight = filters['weatherWeight']
            emissionWeight = filters['emissionWeight']
            startPoint = filters['startPoint']
            endPoint = filters['endPoint']

        # if(self.path_finder is None):
        #     self.loadGraph(request)

        path = self.path_finder.find_best_path(startPoint, endPoint, distanceWeight, weatherWeight, emissionWeight)

        return Response(path)
