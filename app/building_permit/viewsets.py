from rest_framework import status
from rest_framework.decorators import action
import requests
import json
from rest_framework import viewsets
from rest_framework.response import Response



class BuildingPermitViewSet(viewsets.ModelViewSet):

    @action(detail=False)
    def get_calgary_building_permit(self, request):
        filters = self.request.query_params.get('filter', '')
        if filters != None and filters != '':
            filters = json.loads(filters)
            issueDateStart = filters['issueDateStart']
            issueDateEnd = filters['issueDateEnd']

        params = {}
        uri = "https://data.calgary.ca/resource/c2es-76ed.geojson"

        if issueDateStart != None and issueDateEnd != None:
            uri = uri + "?$where=issueddate > '{0}' and issueddate < '{1}'".format(issueDateStart, issueDateEnd)

        res = requests.get(uri, params=params)
        return Response(res.json())
