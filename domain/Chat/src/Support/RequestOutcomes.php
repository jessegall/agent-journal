<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Bus\CallerReceipts;
use App\Contracts\Chat\ConversationResolver;
use App\Enums\ReceiptState;
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
        private CallerReceipts $receipts,
        private ConversationResolver $conversations,
    ) {}

    public function of(RequestOutcomeInput $request): RequestOutcomeData
    {
        $answers = $this->receipts->answerFor(
            $request->operation->command(),
            $request->requestKey,
            $request->target(),
        );

        $notYetObservable = RequestOutcomeData::of(RequestOutcome::NotYetObservable);
        $expired = RequestOutcomeData::of(RequestOutcome::Expired);

        if ($answers === []) {
            return $notYetObservable;
        }

        $receipt = $answers[0];

        if ($receipt->isExpired) {
            return $expired;
        }

        return match ($receipt->state) {
            ReceiptState::Completed => $this->confirmed($request, $receipt->result),
            ReceiptState::Refused => RequestOutcomeData::from([
                'outcome' => RequestOutcome::Refused,
                'code' => $receipt->refusalCode,
                'message' => $receipt->refusalMessage,
            ]),
            ReceiptState::Taken => $notYetObservable,
            ReceiptState::Expired => $expired,
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
