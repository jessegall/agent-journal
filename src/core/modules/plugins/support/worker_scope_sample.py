def refund(order):
    if order.late:
        return 0
    else:
        return order.total
