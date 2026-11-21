<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * A child relay's submission of its broker-verified commit: the delivery id, the claim and runtime generation, the
 * checkout, the delivered tip, the target ref and the target commit it expects there.
 */
final readonly class DeliverySubmission
{
    public function __construct(
        public string $deliveryId,
        public string $childClaimId,
        public int $runtimeGeneration,
        public string $checkout,
        public string $deliveredTip,
        public string $targetRef,
        public string $expectedTargetOid,
    ) {}
}
