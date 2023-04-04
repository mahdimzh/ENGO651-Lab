import networkx as nx
import osmnx as ox
import numpy as np
from shapely.geometry import LineString

class PathFinder:
        
    def __init__(self, graph_file):
        self.graph_loader(graph_file)
        
    def graph_loader(self, graph_file):
        # load the graph
        graph = ox.load_graphml(graph_file)
        nodes_gdf, edges_gdf = ox.graph_to_gdfs(graph)
        edges_gdf['edge_tree_count'] = edges_gdf['edge_tree_count'].astype(int)
        #edges_gdf['slopized_length'] = edges_gdf['slopized_length'].astype(float)
        edges_gdf['grade_abs'] = edges_gdf['grade_abs'].astype(float)
        # convert the pair of GeoDataFrames to a networkx graph object
        self.graph = ox.graph_from_gdfs(nodes_gdf, edges_gdf)

    def softmax(self, x):

        #New test
        """Compute softmax values for each row of x."""
        # Subtract the maximum value in each row for numerical stability
        x -= np.max(x)
        # Compute the exponentials of each element in x
        exp_x = np.exp(x)
        # Compute the sum of exponentials for each row
        sum_exp_x = np.sum(exp_x)
        # Divide each element in exp_x by the sum_exp_x to get the softmax probabilities
        return exp_x / sum_exp_x

    def normalize_weights(self,x1, x2, x3):
        # Find the minimum and maximum values of the metrics
        min_val = min(x1, x2, x3)
        max_val = max(x1, x2, x3)
        
        # Normalize each metric between 0 and 1, avoiding division by zero
        if max_val == min_val:
            x1_norm = x2_norm = x3_norm = 1/3  # set equal weights if all inputs are equal
        else:
            x1_norm = (x1 - min_val) / (max_val - min_val)
            x2_norm = (x2 - min_val) / (max_val - min_val)
            x3_norm = (x3 - min_val) / (max_val - min_val)
        # Ensure the weights add up to 1
        sum_norm = x1_norm + x2_norm + x3_norm
        x1_norm_final = x1_norm / sum_norm
        x2_norm_final = x2_norm / sum_norm
        x3_norm_final = x3_norm / sum_norm
        # Return the normalized weights
        return x1_norm_final, x2_norm_final, x3_norm_final
    

        
    def find_best_path(self, start_point, end_point,distance_weight,weather_weight,emission_weight):
        # if(distance_weight + weather_weight + emission_weight > 1):
        #     distance_weight,weather_weight,emission_weight = self.softmax([distance_weight,weather_weight,emission_weight])
        distance_weight, weather_weight, emission_weight = self.normalize_weights(distance_weight, weather_weight, emission_weight)
        # Find the nearest node in the graph to the start and end points
        start_node = ox.distance.nearest_nodes(self.graph, start_point[1], start_point[0])
        end_node = ox.distance.nearest_nodes(self.graph, end_point[1], end_point[0])

        # Find the shortest path between the start and end nodes
        #shortest_path_lenght = nx.shortest_path(graph, start_node, end_node, weight='length')
        #shortest_path_slope = nx.shortest_path(graph, start_node, end_node, weight='slopized_length')
        #shortest_path_tree_count = nx.shortest_path(graph, start_node, end_node, weight='edge_tree_count')

        shortest_path_lenght = ox.distance.shortest_path(self.graph, start_node, end_node, weight='length')
        # shortest_path_slope = ox.distance.shortest_path(self.graph, start_node, end_node, weight='slopized_length')
        shortest_path_slope = ox.distance.shortest_path(self.graph, start_node, end_node, weight='grade_abs')
        shortest_path_tree_count = ox.distance.shortest_path(self.graph, start_node, end_node, weight='edge_tree_count')

        # Calculate the normalized values for each criterion
        max_distance = max([ox.distance.great_circle_vec(self.graph.nodes[path[0]]['y'], self.graph.nodes[path[0]]['x'], self.graph.nodes[path[-1]]['y'], self.graph.nodes[path[-1]]['x']) for path in [shortest_path_lenght, shortest_path_slope, shortest_path_tree_count]])
        max_slope = max([max([self.graph.edges[u, v, 0]['grade_abs'] for u, v in zip(path[:-1], path[1:])]) for path in [shortest_path_lenght, shortest_path_slope, shortest_path_tree_count]])
        max_tree_count = max([sum([self.graph.edges[u, v, 0].get('edge_tree_count', 0) for u, v in zip(path[:-1], path[1:])]) for path in [shortest_path_lenght, shortest_path_slope, shortest_path_tree_count]])
        normalized_distance = [(ox.distance.great_circle_vec(self.graph.nodes[path[0]]['y'], self.graph.nodes[path[0]]['x'], self.graph.nodes[path[-1]]['y'], self.graph.nodes[path[-1]]['x']) / max_distance) for path in [shortest_path_lenght, shortest_path_slope, shortest_path_tree_count]]
        normalized_slope = [([self.graph.edges[u, v, 0]['grade_abs'] / max_slope for u, v in zip(path[:-1], path[1:])]) for path in [shortest_path_lenght, shortest_path_slope, shortest_path_tree_count]]
        normalized_tree_count = [sum([self.graph.edges[u, v, 0].get('edge_tree_count', 0) / max_tree_count for u, v in zip(path[:-1], path[1:])]) for path in [shortest_path_lenght, shortest_path_slope, shortest_path_tree_count]]

        # Calculate the weighted score for each path
      
        weighted_scores = []
        for i, path in enumerate([shortest_path_lenght, shortest_path_slope, shortest_path_tree_count]):
            weighted_score = (normalized_distance[i] * distance_weight) + (np.sum(normalized_slope[i]) * weather_weight) + (normalized_tree_count[i] * emission_weight)
            #print(f'Path: {i}, Weighted Score: {weighted_score}')
            weighted_scores.append(weighted_score)

        # Choose the path with the highest weighted score as the best path
        best_path_index = np.argmin(weighted_scores)
        best_path = [shortest_path_lenght, shortest_path_slope, shortest_path_tree_count][best_path_index]
        #print(f'Best Path: {best_path_index}')
        # create an empty list to store the edges
        edges = []

        # iterate over pairs of nodes and find the edges between them
        for i in range(len(best_path)-1):
            start_node = best_path[i]
            end_node = best_path[i+1]
            out_edges = list(self.graph.out_edges(start_node, data=True))
            edge = None
            for u, v, d in out_edges:
                if v == end_node:
                    # edge = (u, v, d)
                    edge_geometry = LineString(d['geometry'])

                    edge = {
                        'u':u,
                        'v': v,
                        'points': [(point[1],point[0]) for point in edge_geometry.coords]
                    }
                    break
            edges.append(edge)
            
        result_dict = {
            'nodes':best_path,
            'edges': edges
        }
        return result_dict
        