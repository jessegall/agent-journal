<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CallerReceipts;
use App\Data\Profiles\SignInReceiptData;
use App\Enums\ReceiptState;
use App\Enums\SignInReceiptStatus;
use App\Http\Requests\Profiles\SignInReceiptRequest;
use App\Models\Accounts\SignInAttempt;

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
            ReceiptState::Completed => $this->startedFrom($receipt->fields),
            ReceiptState::Refused => SignInReceiptData::without(SignInReceiptStatus::Refused, $receipt->refusalMessage),
            ReceiptState::Taken => SignInReceiptData::without(SignInReceiptStatus::Pending),
            ReceiptState::Expired => SignInReceiptData::without(SignInReceiptStatus::Expired),
        };
    }

    /**
     * The attempt a completed receipt names; a receipt that names none is unknown.
     *
     * @param  array<string, mixed>  $fields
     */
    private function startedFrom(array $fields): SignInReceiptData
    {
        $attemptId = $fields['attemptId'] ?? null;

        return is_string($attemptId) ? $this->started($attemptId) : SignInReceiptData::without(
            SignInReceiptStatus::Unknown,
        );
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
