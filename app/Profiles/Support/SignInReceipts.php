<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Bus\Contracts\CallerReceipts;
use App\Bus\Enums\ReceiptState;
use App\Http\Data\Profiles\SignInReceiptData;
use App\Http\Requests\Profiles\SignInReceiptRequest;
use App\Profiles\Enums\SignInReceiptStatus;
use App\Profiles\Models\SignInAttempt;

/**
 * Tells the owner what became of a sign-in start under its request key. It reads only the owner's receipt of that
 * start for that driver or account, and names the attempt only while the owner may still read it.
 */
final readonly class SignInReceipts
{
    public function __construct(private CallerReceipts $receipts) {}

    public function of(SignInReceiptRequest $request): SignInReceiptData
    {
        $answers = $this->receipts->answerFor($request->command(), $request->requestKey(), $request->target());

        if ($answers === []) {
            return SignInReceiptData::without(SignInReceiptStatus::Unknown);
        }

        $receipt = $answers[0];
        $state = $receipt->isExpired ? ReceiptState::Expired : $receipt->state;

        return match ($state) {
            ReceiptState::Completed => $this->started((string) ($receipt->fields['attemptId'] ?? '')),
            ReceiptState::Refused => SignInReceiptData::without(SignInReceiptStatus::Refused, $receipt->refusalMessage),
            ReceiptState::Taken => SignInReceiptData::without(SignInReceiptStatus::Pending),
            ReceiptState::Expired => SignInReceiptData::without(SignInReceiptStatus::Expired),
        };
    }

    private function started(string $attemptId): SignInReceiptData
    {
        $attempt = SignInAttempt::readableByOwner($attemptId);

        if ($attempt === null) {
            return SignInReceiptData::without(SignInReceiptStatus::Unknown);
        }

        return new SignInReceiptData(
            SignInReceiptStatus::Started,
            $attempt->id,
            $attempt->type(),
            $attempt->resultAccount?->id,
            $attempt->method,
            $attempt->state,
            null,
        );
    }
}
