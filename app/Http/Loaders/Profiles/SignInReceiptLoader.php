<?php

declare(strict_types=1);

namespace App\Http\Loaders\Profiles;

use App\Data\Accounts\SignInReceiptData;
use App\Data\Profiles\SignInReceiptInput;
use App\Support\SignInReceipts;

/**
 * What became of the owner's own sign-in start under a request key: the receipt is read for the sign-in this caller
 * started, so another's key tells nothing.
 */
final readonly class SignInReceiptLoader
{
    public function __construct(private SignInReceipts $receipts) {}

    public function __invoke(SignInReceiptInput $input): SignInReceiptData
    {
        return $this->receipts->of($input);
    }
}
