<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Support;

use App\Models\Sessions\SessionPolicy;
use App\Values\AccessPolicy;
use App\Values\OperationGrant;
use App\Values\ResourceRequest;
use App\Values\StartPolicy;
use Tests\Fixtures\Agents\TestStart;

/**
 * A parent start whose session policy grants it the reading of a document's kept drafts.
 */
trait GrantsDraftReads
{
    private function grantDraftReads(TestStart $parent, string $documentId): void
    {
        $start = StartPolicy::mainOnHost(base_path());
        $source = ResourceRequest::record('documents.document:'.$documentId);
        $grant = new OperationGrant('docs_drafts_read', [$source]);
        $access = new AccessPolicy([], [], $start->access->processes, [$grant]);
        SessionPolicy::create($parent->session, new StartPolicy(
            $access,
            $start->stopConditions,
            $start->execution,
            null,
            null,
            null,
        ));
    }
}
