<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Exceptions\DriverRequestRefused;
use App\Models\Drivers\DriverRequest;
use App\Sessions\States\Support\ChangeEffortStateReference;
use App\Sessions\States\Support\ChangeModelStateReference;
use App\Stacks\Contracts\Work\AgentStacks;
use App\Values\DriverRequestPayload;
use App\Values\StackTarget;

/**
 * Accepts a change of a session's model or effort: the request supersedes the earlier unrun request of its own
 * setting, and a state on the session's stack owns the change until the driver applied it.
 */
final readonly class DriverSettings
{
    /**
     * The efforts every supported driver build offers.
     *
     * @var list<string>
     */
    public const array EFFORTS = [
        'low',
        'medium',
        'high',
        'xhigh',
        'max',
    ];

    public function __construct(private DriverRequestLedger $requests, private AgentStacks $stacks) {}

    public function acceptModel(StackTarget $target, string $idempotencyKey, string $model): DriverRequest
    {
        if (trim($model) === '') {
            throw DriverRequestRefused::emptyModel();
        }

        $request = $this->requests->append(
            $target,
            DriverOperation::ChangeModel,
            $idempotencyKey,
            DriverRequestPayload::model($model),
        );

        if ($request->wasRecentlyCreated) {
            $this->requests->supersedeEarlier($request);
            $this->stacks->pushForSession($target, ChangeModelStateReference::forRequest($request, $target));
        }

        return $request;
    }

    public function acceptEffort(StackTarget $target, string $idempotencyKey, string $effort): DriverRequest
    {
        if (! in_array($effort, self::EFFORTS, true)) {
            throw DriverRequestRefused::unsupportedEffort($effort, self::EFFORTS);
        }

        $request = $this->requests->append(
            $target,
            DriverOperation::ChangeEffort,
            $idempotencyKey,
            DriverRequestPayload::effort($effort),
        );

        if ($request->wasRecentlyCreated) {
            $this->requests->supersedeEarlier($request);
            $this->stacks->pushForSession($target, ChangeEffortStateReference::forRequest($request, $target));
        }

        return $request;
    }
}
