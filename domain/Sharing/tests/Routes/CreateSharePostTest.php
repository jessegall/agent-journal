<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\SharingDomain;
use Domain\Sharing\Support\ShareSummary;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner shares a record as the saved preview shows it.
 */
#[TestsRoute('POST', 'sharing.create-share')]
final class CreateSharePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SharingDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $document = $journal->owner()->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));
        $root = Document::query()->findOrFail($document->id)->shareIdentity();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $preview = $journal->run(new SaveSharePreviewCommand($root->type, $root->id, [], $configuration->id));

        return RouteCall::as(Caller::User)
            ->parameters([
                'reference' => "doc {$document->number}",
            ])
            ->headers([
                'Idempotency-Key' => 'share-1',
            ])
            ->payload([
                'previewId' => $preview->previewId,
                'previewChecksum' => $preview->checksum,
            ])
            ->reply(CreateShareCommand::class, new ShareSummary(
                strtolower((string) Str::ulid()),
                1,
                ShareStatus::Pending,
            ))
            ->expects(CreateShareCommand::class, [
                'previewId' => $preview->previewId,
                'previewChecksum' => $preview->checksum,
                'requestKey' => 'share-1',
            ]);
    }
}
