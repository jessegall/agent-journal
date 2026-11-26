<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use Domain\Chat\Support\PairChats;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner asks an agent for feedback on a document in their pair chat.
 */
#[TestsRoute('POST', 'documents.ask-feedback')]
final class AskFeedbackPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $document = $journal->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText."));
        $journal->idleAgent('Reviewer');
        $inboxId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'document' => $document->number,
            ])
            ->payload([
                'agent' => $journal->agentCalled('Reviewer')->id,
            ])
            ->reply(OpenInboxCommand::class, $inboxId)
            ->reply(SendMessageCommand::class, Str::ulid())
            ->expects(OpenInboxCommand::class, [
                'providerKey' => PairChats::PAIR_PROVIDER,
            ])
            ->expects(SendMessageCommand::class, [
                'inboxId' => $inboxId,
            ]);
    }
}
