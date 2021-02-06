# Pathfinder-visualizer

Graphical UI index implementing various search and path algorithms related to graph theory. You can access it here. https://geramoidx.github.io/pathfinder-visualizer/

## Overview of Pathfinding Algorithms

This project implements the following pathfinding and search algorithms.

**Dijkstra's Algorithm** (weighted): the father of pathfinding algorithms. Guarantees the shortest path possible.

**A Search*** (weighted): arguably the best pathfinding algorithm. Uses heuristics to guarantee the best shortest possible path much faster than the Dijkstra's algorithm.

**Greedy Best First Search** (weighted): a faster, more heuristic-heavy version of A*; does not guarantee the shortest possible path.

**Swarm Algorithm** (weighted): a mixture of Dijkstra and A*; does not guarantee the shortest possible path.

**Convergent Swarm Algorithm** (weighted): a faster, more heuristic-heavy version of Swarm; does not guarantee the shortest possible path.

**Bidirectional Swarm Algorithm** (weighted): Swarm from both sides; does not guarantee the shortest possible path.

## More about the Swarm Algorithm

The Swarm algorithm is an algorithm that was developed by Clement Mihailescu, CEO of algoexpert.io, and a colleague, Hussein Farah. In their own words, the algorithm is essentially a mixture of Dijkstra's Algorithm and A* Search; more precisely, while it converges to the target node like A* , it still explores quite a few neighboring nodes surrounding the start node like Dijkstra's. The algorithm differentiates itself from A* through its use of heuristics: it continually updates nodes' distance from the start node while taking into account their estimated distance from the target node. This effectively "balances" the difference in total distance between nodes closer to the start node and nodes closer to the target node, which results in the triangle-like shape of the Swarm Algorithm. We named the algorithm "Swarm" because one of its potential applications could be seen in a video-game where a character must keep track of a boss with high priority (the target node), all the while keeping tracking of neighboring enemies that might be swarming nearby.
