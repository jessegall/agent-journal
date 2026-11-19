<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\MessagePage;
use App\Ui\Contracts\PageResolver;
use Domain\Chat\Data\HistoryPageData;
use Domain\Chat\Http\Requests\HistoryRequest;
use Spatie\LaravelData\Optional;

/**
 * Reads the History page: an inbox the reader sits at as its own history, any other as an inspection the policy must
 * admit. Neither marks anything read or takes anything up.
 */
final readonly class HistoryPageResolver implements PageResolver
{
    public function __construct(
        private HistoryRequest $request,
        private ConversationResolver $messages,
    ) {}

    public function read(): HistoryPageData
    {
        if ($this->request->chosenInbox()->isEmpty()) {
            return HistoryPageData::from(
                ['inboxId' => Optional::create(), 'isInspection' => false, 'page' => Optional::create()],
            );
        }

        $inboxId = $this->request->chosenInbox()->get();
        $own = $this->messages->sitsAt($inboxId);
        $older = $this->request->olderCursor();
        $page = $own
            ? $this->messages->history($inboxId, $older, MessagePage::DEFAULT_LIMIT)
            : $this->messages->inspect($inboxId, $older, MessagePage::DEFAULT_LIMIT);

        return HistoryPageData::from(['inboxId' => $inboxId, 'isInspection' => ! $own, 'page' => $page]);
    }
}
