# @sin story_step_duplicate
def expect_order_total(order, expected):
    actual = order.total()
    assert actual == expected, actual


# @sin story_step_duplicate
def expect_basket_total(order, expected):
    actual = order.total()
    assert actual == expected, actual


# @righteous story_step_duplicate
def expect_customer_name(order, expected):
    actual = order.customer()
    assert actual == expected, actual


# @righteous story_step_duplicate
def order_discount(order, expected):
    return order.discount() - expected


# @righteous story_step_duplicate
def basket_discount(order, expected):
    return order.discount() - expected
