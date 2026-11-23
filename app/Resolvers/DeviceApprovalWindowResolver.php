<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Data\Connections\DeviceApprovalData;
use App\Enums\BindingReadiness;
use App\Exceptions\PrivateRecordMissing;
use App\Http\Requests\Connections\DeviceApprovalPageRequest;
use App\Models\DeviceGrant;
use App\Support\ServerOrigin;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * The terminal request the owner checks before approving it, as the journal holds it now, so a reload or a second
 * tab shows its committed state. An unknown code finds nothing, as a code of another owner does.
 */
final readonly class DeviceApprovalWindowResolver implements PageResolver
{
    public function __construct(private DeviceApprovalPageRequest $page, private ServerOrigin $origin) {}

    /**
     * The approval a terminal asked for, read only: reading it never approves it or issues a code; a code that does not
     * exist answers as a private record does.
     *
     * @throws PrivateRecordMissing
     */
    public function read(): DeviceApprovalData
    {
        try {
            $grant = DeviceGrant::ofUserCode($this->page->userCode());
        } catch (ModelNotFoundException $missing) {
            throw PrivateRecordMissing::forReader($missing);
        }

        return DeviceApprovalData::from([
            'userCode' => $grant->user_code,
            'projectLabel' => $grant->binding->project_label,
            'machineLabel' => $grant->binding->machine_label,
            'scopes' => $grant->scopes,
            'expiresAt' => $grant->code_expires_at->toIso8601String(),
            'journalOrigin' => $this->origin->canonical(),
            'environmentLabel' => $grant->environment->label ?? 'no environment yet',
            'state' => $grant->approvalStateAt(CarbonImmutable::now()),
            'isBindingRevoked' => $grant->binding->readiness === BindingReadiness::Revoked,
        ]);
    }
}
