<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

/**
 * A refusal a keyed write got from the receipt already under its key, not from running: it stores no new receipt.
 */
interface ReceiptRefusal {}
