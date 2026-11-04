# @sin StoryStepDuplicateDetector
def expect_order_total(order, expected):
    actual = order.total()
    assert actual == expected, actual


# @sin StoryStepDuplicateDetector
def expect_basket_total(order, expected):
    actual = order.total()
    assert actual == expected, actual


# @righteous StoryStepDuplicateDetector
def expect_customer_name(order, expected):
    actual = order.customer()
    assert actual == expected, actual


# @righteous StoryStepDuplicateDetector
def order_discount(order, expected):
    return order.discount() - expected


# @righteous StoryStepDuplicateDetector
def basket_discount(order, expected):
    return order.discount() - expected
