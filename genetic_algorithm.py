import random
import math

POPULATION_SIZE = 100
GENERATIONS = 200
MUTATION_RATE = 0.05
CROSSOVER_RATE = 0.8
ELITE_SIZE = 5

def fitness(chromosome):
    x, y = chromosome
    return 1 / (1 + math.sin(x) * math.cos(y) + 0.1 * (x**2 + y**2))

def create_chromosome():
    return (random.uniform(-10, 10), random.uniform(-10, 10))

def select_parents(population, fitnesses):
    tournament = random.sample(list(zip(population, fitnesses)), 3)
    return max(tournament, key=lambda x: x[1])[0]

def crossover(parent1, parent2):
    if random.random() < CROSSOVER_RATE:
        alpha = random.random()
        child1 = (
            alpha * parent1[0] + (1 - alpha) * parent2[0],
            alpha * parent1[1] + (1 - alpha) * parent2[1]
        )
        child2 = (
            (1 - alpha) * parent1[0] + alpha * parent2[0],
            (1 - alpha) * parent1[1] + alpha * parent2[1]
        )
        return child1, child2
    return parent1, parent2

def mutate(chromosome):
    if random.random() < MUTATION_RATE:
        return (
            chromosome[0] + random.uniform(-0.5, 0.5),
            chromosome[1] + random.uniform(-0.5, 0.5)
        )
    return chromosome

def genetic_algorithm():
    population = [create_chromosome() for _ in range(POPULATION_SIZE)]
    
    for generation in range(GENERATIONS):
        fitnesses = [fitness(chromosome) for chromosome in population]
        
        sorted_pop = sorted(zip(population, fitnesses), key=lambda x: x[1], reverse=True)
        
        print(f"Generation {generation + 1}: Best fitness = {sorted_pop[0][1]:.6f}")
        
        new_population = [chromosome for chromosome, _ in sorted_pop[:ELITE_SIZE]]
        
        while len(new_population) < POPULATION_SIZE:
            parent1 = select_parents(population, fitnesses)
            parent2 = select_parents(population, fitnesses)
            child1, child2 = crossover(parent1, parent2)
            new_population.append(mutate(child1))
            if len(new_population) < POPULATION_SIZE:
                new_population.append(mutate(child2))
        
        population = new_population
    
    best = max(population, key=fitness)
    return best, fitness(best)

if __name__ == "__main__":
    random.seed(42)
    best_solution, best_fitness = genetic_algorithm()
    print(f"\nBest solution: x = {best_solution[0]:.4f}, y = {best_solution[1]:.4f}")
    print(f"Best fitness: {best_fitness:.6f}")