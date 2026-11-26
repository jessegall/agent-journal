<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Values\CreatedRecord;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent files a new document.
 */
#[TestsRoute('POST', 'documents.agent.docs.make')]
final class AgentDocsMakePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'title' => 'Design',
                'abstract' => 'The plan.',
                'about' => [],
                'body' => '# Design',
                'request_key' => 'documents-1',
            ])
            ->reply(CreateDocumentCommand::class, new CreatedRecord(
                strtolower((string) Str::ulid()),
                7,
                'documents.document',
            ))
            ->expects(CreateDocumentCommand::class, [
                'title' => 'Design',
                'abstract' => 'The plan.',
                'body' => '# Design',
                'relatedRecords' => [],
            ]);
    }
}
