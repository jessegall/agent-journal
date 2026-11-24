<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\DeliveryOutcome;
use App\Exceptions\DeliveryRefused;
use App\Models\Agents\ChildClaim;
use App\Values\DeliveryReceipt;
use App\Values\DeliverySubmission;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One child's broker-verified commit submitted for integration, apart from any message, and the merger's separate
 * result.
 *
 * @property string $id
 * @property string $delivery_id
 * @property string $binding_id
 * @property string $child_claim_id
 * @property int $runtime_generation
 * @property string $checkout
 * @property string $base_oid
 * @property string $delivered_tip
 * @property string $target_ref
 * @property string $expected_target_oid
 * @property DeliveryOutcome $outcome
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'delivery_id', 'binding_id', 'child_claim_id', 'runtime_generation', 'checkout', 'base_oid', 'delivered_tip',
    'target_ref', 'expected_target_oid',
])]
final class WorktreeDelivery extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'runtime_generation' => 'integer',
            'outcome' => DeliveryOutcome::class,
        ];
    }

    /**
     * Records the submission once under its delivery id; an identical retry answers the same row and another tip
     * under the same id is refused.
     *
     * @throws DeliveryRefused
     */
    public static function submit(ChildClaim $claim, DeliverySubmission $submission): self
    {
        $earlier = self::query()->where('delivery_id', $submission->deliveryId)->lockForUpdate()->first();

        if ($earlier instanceof self && $earlier->delivered_tip !== $submission->deliveredTip) {
            throw DeliveryRefused::otherCommit($submission->deliveryId);
        }

        if ($earlier instanceof self) {
            return $earlier;
        }

        $delivery = new self();
        $delivery->delivery_id = $submission->deliveryId;
        $delivery->binding_id = $claim->binding_id;
        $delivery->child_claim_id = $claim->id;
        $delivery->runtime_generation = $submission->runtimeGeneration;
        $delivery->checkout = $submission->checkout;
        $delivery->base_oid = $claim->base_oid;
        $delivery->delivered_tip = $submission->deliveredTip;
        $delivery->target_ref = $submission->targetRef;
        $delivery->expected_target_oid = $submission->expectedTargetOid;
        $delivery->outcome = DeliveryOutcome::Submitted;
        $delivery->save();

        return $delivery;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<DeliveryReceipt, never>
     */
    protected function receipt(): Attribute
    {
        return Attribute::get(
            fn () => new DeliveryReceipt($this->delivery_id, $this->delivered_tip, $this->outcome->value),
        )->withoutObjectCaching();
    }
}
