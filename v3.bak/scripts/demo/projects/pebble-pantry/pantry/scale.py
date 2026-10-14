def scale(amount, guests, serves):
    return amount * guests / serves


def scaled(recipe, guests):
    return {name: scale(amount, guests, recipe["serves"]) for name, amount in recipe["amounts"].items()}
