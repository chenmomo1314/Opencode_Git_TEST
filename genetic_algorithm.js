const POPULATION_SIZE = 100;
const GENERATIONS = 200;
const MUTATION_RATE = 0.05;
const CROSSOVER_RATE = 0.8;
const ELITE_SIZE = 5;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function fitness(chromosome) {
    const [x, y] = chromosome;
    return 1 / (1 + Math.sin(x) * Math.cos(y) + 0.1 * (x * x + y * y));
}

function createChromosome() {
    return [random(-10, 10), random(-10, 10)];
}

function selectParents(population, fitnesses) {
    const tournament = [];
    for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * population.length);
        tournament.push({ chromosome: population[idx], fit: fitnesses[idx] });
    }
    return tournament.reduce((max, p) => p.fit > max.fit ? p : max).chromosome;
}

function crossover(parent1, parent2) {
    if (Math.random() < CROSSOVER_RATE) {
        const alpha = Math.random();
        const child1 = [
            alpha * parent1[0] + (1 - alpha) * parent2[0],
            alpha * parent1[1] + (1 - alpha) * parent2[1]
        ];
        const child2 = [
            (1 - alpha) * parent1[0] + alpha * parent2[0],
            (1 - alpha) * parent1[1] + alpha * parent2[1]
        ];
        return [child1, child2];
    }
    return [parent1, parent2];
}

function mutate(chromosome) {
    if (Math.random() < MUTATION_RATE) {
        return [
            chromosome[0] + random(-0.5, 0.5),
            chromosome[1] + random(-0.5, 0.5)
        ];
    }
    return chromosome;
}

function geneticAlgorithm() {
    let population = Array.from({ length: POPULATION_SIZE }, createChromosome);
    
    for (let generation = 0; generation < GENERATIONS; generation++) {
        const fitnesses = population.map(fitness);
        
        const sorted = population
            .map((c, i) => [c, fitnesses[i]])
            .sort((a, b) => b[1] - a[1]);
        
        console.log(`Generation ${generation + 1}: Best fitness = ${sorted[0][1].toFixed(6)}`);
        
        let newPopulation = sorted.slice(0, ELITE_SIZE).map(x => x[0]);
        
        while (newPopulation.length < POPULATION_SIZE) {
            const parent1 = selectParents(population, fitnesses);
            const parent2 = selectParents(population, fitnesses);
            const [child1, child2] = crossover(parent1, parent2);
            newPopulation.push(mutate(child1));
            if (newPopulation.length < POPULATION_SIZE) {
                newPopulation.push(mutate(child2));
            }
        }
        
        population = newPopulation;
    }
    
    const best = population.reduce((best, c) => fitness(c) > fitness(best) ? c : best);
    return [best, fitness(best)];
}

const [bestSolution, bestFitness] = geneticAlgorithm();
console.log(`\nBest solution: x = ${bestSolution[0].toFixed(4)}, y = ${bestSolution[1].toFixed(4)}`);
console.log(`Best fitness: ${bestFitness.toFixed(6)}`);