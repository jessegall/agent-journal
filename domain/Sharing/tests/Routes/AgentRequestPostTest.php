<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Domain\Sharing\Commands\RequestShare\RequestShareCommand;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\SharingDomain;
use Domain\Sharing\Support\ShareProposalStatus;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent asks the owner to share a record.
 */
#[TestsRoute('POST', 'shares.agent.request')]
final class AgentRequestPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SharingDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $document = $journal->runAs('Writer', new CreateDocumentCommand('Design', 'The plan.', "# Design\nText."));
        $root = Document::query()->findOrFail($document->id)->shareIdentity();

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'alias' => 'doc',
                'number' => (string) $document->number,
                'request_key' => 'share-1',
            ])
            ->reply(RequestShareCommand::class, new ShareProposalStatus(1, ShareStatus::Proposed))
            ->expects(RequestShareCommand::class, [
                'rootType' => $root->type,
                'rootId' => $root->id,
                'requestKey' => 'share-1',
            ]);
    }
}
