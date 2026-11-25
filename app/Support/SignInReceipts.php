<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CallerReceipts;
use App\Data\Accounts\SignInReceiptData;
use App\Data\Profiles\SignInReceiptInput;
use App\Enums\Accounts\SignInReceiptStatus;
use App\Enums\CommandRules\ReceiptStatus;
use App\Models\Accounts\SignInAttempt;

/**
 * Tells the owner what became of a sign-in start under its request key. It reads only the owner's receipt of that
 * start for that driver or account, and names the attempt only while the owner may still read it.
 */
final readonly class SignInReceipts
{
    public function __construct(private CallerReceipts $receipts) {}

    public function of(SignInReceiptInput $input): SignInReceiptData
    {
        $answers = $this->receipts->answerFor($input->command(), $input->key, $input->target());

        if ($answers === []) {
            return SignInReceiptData::without(SignInReceiptStatus::Unknown);
        }

        $receipt = $answers[0];
        $state = $receipt->isExpired ? ReceiptStatus::Expired : $receipt->state;

        return match ($state) {
            ReceiptStatus::Completed => $this->startedFrom($receipt->fields),
            ReceiptStatus::Refused => SignInReceiptData::without(SignInReceiptStatus::Refused, $receipt->refusalMessage),
            ReceiptStatus::Taken => SignInReceiptData::without(SignInReceiptStatus::Pending),
            ReceiptStatus::Expired => SignInReceiptData::without(SignInReceiptStatus::Expired),
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

        if (is_string($attemptId)) {
            return $this->started($attemptId);
        }

        return SignInReceiptData::without(
            SignInReceiptStatus::Unknown,
        );
    }

    private function started(string $attemptId): SignInReceiptData
    {
        $attempt = SignInAttempt::findReadableByOwner($attemptId);

        if ($attempt === null) {
            return SignInReceiptData::without(SignInReceiptStatus::Unknown);
        }

        return new SignInReceiptData(
            SignInReceiptStatus::Started,
            $attempt->id,
            $attempt->type,
            $attempt->resultAccount?->id,
            $attempt->method,
            $attempt->status,
            null,
        );
    }
}
