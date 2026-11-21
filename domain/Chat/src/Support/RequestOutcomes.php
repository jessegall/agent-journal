<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Bus\Enums\ReceiptState;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\ReceiptCallers;
use App\Communication\Contracts\ConversationResolver;
use Domain\Chat\Data\RequestOutcomeData;
use Domain\Chat\Data\RequestOutcomeInput;
use Domain\Chat\Enums\RequestOutcome;

/**
 * Tells the browser what became of its own send or reply under a request key. It reads only the caller's receipt of
 * that command, answers nothing for another target, and names a message only while the caller may still see it.
 */
final readonly class RequestOutcomes
{
    public function __construct(
        private ReceiptCallers $callers,
        private ConversationResolver $conversations,
    ) {}

    public function of(RequestOutcomeInput $request): RequestOutcomeData
    {
        $command = $request->operation->command();
        $caller = $this->callers->forCommand($command, $this->callers->current()->actor);
        $receipt = CommandReceipt::readFor($caller, $command, $request->requestKey);

        if ($receipt === null || ! $receipt->isForTarget($request->target())) {
            return RequestOutcomeData::of(RequestOutcome::NotYetObservable);
        }

        if ($receipt->isExpired()) {
            return RequestOutcomeData::of(RequestOutcome::Expired);
        }

        return match ($receipt->state) {
            ReceiptState::Completed => $this->confirmed($request, (string) $receipt->result['value']),
            ReceiptState::Refused => RequestOutcomeData::from([
                'outcome' => RequestOutcome::Refused,
                'code' => (string) $receipt->refusal_code,
                'message' => (string) $receipt->refusal_message,
            ]),
            ReceiptState::Taken => RequestOutcomeData::of(RequestOutcome::NotYetObservable),
            ReceiptState::Expired => RequestOutcomeData::of(RequestOutcome::Expired),
        };
    }

    private function confirmed(RequestOutcomeInput $request, string $messageId): RequestOutcomeData
    {
        $answered = $request->answeredMessageId();
        $mayStillSee = $this->conversations->canSee($messageId)
            && ($answered === null || $this->conversations->canSee($answered));

        return $mayStillSee
            ? RequestOutcomeData::from(['outcome' => RequestOutcome::Confirmed, 'messageId' => $messageId])
            : RequestOutcomeData::of(RequestOutcome::NoLongerVisible);
    }
}
