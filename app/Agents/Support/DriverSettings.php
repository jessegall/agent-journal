<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\DriverOperation;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Models\DriverRequest;
use App\Agents\Values\DriverRequestPayload;

/**
 * Accepts a model and an effort as one settings change: the pair is validated before either is accepted, and each
 * supersedes the earlier unrun request of its own field (doc 40, section 15).
 */
final readonly class DriverSettings
{
    /**
     * The efforts every supported program build offers (plan 26 phase 1 evidence, doc 46).
     *
     * @var list<string>
     */
    public const array EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];

    public function __construct(private DriverRequests $requests) {}

    /**
     * @return list<DriverRequest>
     */
    public function accept(StackTarget $target, string $idempotencyKey, string|null $model, string|null $effort): array
    {
        if ($model !== null && trim($model) === '') {
            throw DriverRequestRefused::emptyModel();
        }

        if ($effort !== null && ! in_array($effort, self::EFFORTS, true)) {
            throw DriverRequestRefused::unsupportedEffort($effort, self::EFFORTS);
        }

        $accepted = [];

        if ($model !== null) {
            $accepted[] = $this->requests->append(
                $target,
                DriverOperation::ChangeModel,
                $idempotencyKey.':model',
                DriverRequestPayload::model($model),
            );
        }

        if ($effort !== null) {
            $accepted[] = $this->requests->append(
                $target,
                DriverOperation::ChangeEffort,
                $idempotencyKey.':effort',
                DriverRequestPayload::effort($effort),
            );
        }

        foreach ($accepted as $request) {
            $this->requests->supersedeEarlier($request);
        }

        return $accepted;
    }
}
