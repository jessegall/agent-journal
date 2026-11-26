<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Domain\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use Domain\Sharing\Commands\RequestShare\RequestShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\SharingDomain;
use Domain\Sharing\Support\ShareSummary;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner approves an agent's request to share a record.
 */
#[TestsRoute('POST', 'sharing.approve-share-request')]
final class ApproveShareRequestPostTest extends GuardedRouteEntryTestCase
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
        $start = $journal->signedStart('Writer');

        $journal->actAsAgentIds($start->agent->id, $start->session->id)
            ->run(new RequestShareCommand($root->type, $root->id, 'request-1'));

        $journal->actAs('Owner');
        $share = Share::query()->sole();
        $preview = $journal->run(new SaveSharePreviewCommand($root->type, $root->id, [], $configuration->id));

        return RouteCall::as(Caller::User)
            ->parameters(['share' => $share->id])
            ->headers(['Idempotency-Key' => 'share-1'])
            ->payload(['previewId' => $preview->previewId, 'previewChecksum' => $preview->checksum])
            ->reply(ApproveShareRequestCommand::class, new ShareSummary(
                $share->id,
                $share->number,
                ShareStatus::Active,
            ))
            ->expects(ApproveShareRequestCommand::class, [
                'shareId' => $share->id,
                'previewId' => $preview->previewId,
                'previewChecksum' => $preview->checksum,
                'requestKey' => 'share-1',
            ]);
    }
}
