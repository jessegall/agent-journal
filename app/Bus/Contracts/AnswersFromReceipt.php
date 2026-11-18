<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

/**
 * A refusal a keyed write got from the receipt already under its key, not from running: it stores no new receipt.
 */
interface AnswersFromReceipt {}
