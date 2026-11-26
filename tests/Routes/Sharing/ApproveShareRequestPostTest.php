<?php

declare(strict_types=1);

namespace Tests\Routes\Sharing;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use App\Sharing\Commands\RequestShare\RequestShareCommand;
use App\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\ShareSummary;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestProjects;

/**
 * The owner approves an agent's request to share a record.
 */
#[TestsRoute('POST', 'sharing.approve-share-request')]
final class ApproveShareRequestPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
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
