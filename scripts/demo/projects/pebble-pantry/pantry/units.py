GRAMS_PER_CUP = {"flour": 120, "sugar": 200}
GRAMS_PER_SPOON = {"flour": 8, "sugar": 12}


def grams(ingredient, cups):
    return cups * GRAMS_PER_CUP[ingredient]
