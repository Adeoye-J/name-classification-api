
export function buildResponse(name, data) {
    const { gender, probability, count } = data

    const sample_size = count
    
    const is_confident = (Number(probability) >= 0.7) && (sample_size >= 100)

    const processed_at = new Date().toISOString();

    return {
        name: name.toLowerCase(),
        gender,
        probability: Number(probability),
        sample_size,
        is_confident,
        processed_at
    }
}
