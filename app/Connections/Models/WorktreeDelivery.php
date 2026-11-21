<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Connections\Enums\DeliveryOutcome;
use App\Connections\Exceptions\DeliveryRefused;
use App\Connections\Values\DeliveryReceipt;
use App\Connections\Values\DeliverySubmission;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
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
 * @property string|null $resulting_target_oid
 * @property bool|null $tip_is_reachable
 * @property list<string> $conflict_paths
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
            'tip_is_reachable' => 'boolean',
            'conflict_paths' => 'array',
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
            throw DeliveryRefused::otherTip($submission->deliveryId);
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
        $delivery->conflict_paths = [];
        $delivery->save();

        return $delivery;
    }

    // ----------[ Mutations ]----------

    /**
     * The merger integrated the tip: the target's resulting commit and whether the tip is reachable from it.
     */
    public function recordMerged(string $resultingTargetOid, bool $tipIsReachable): void
    {
        $this->outcome = DeliveryOutcome::Merged;
        $this->resulting_target_oid = $resultingTargetOid;
        $this->tip_is_reachable = $tipIsReachable;
        $this->save();
    }

    /**
     * The merge conflicted: its paths are kept with both commit ids, and the worker branch stays.
     *
     * @param  list<string>  $paths
     */
    public function recordConflict(string $targetOid, array $paths): void
    {
        $this->outcome = DeliveryOutcome::Conflicted;
        $this->resulting_target_oid = $targetOid;
        $this->conflict_paths = $paths;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function receipt(): DeliveryReceipt
    {
        return new DeliveryReceipt($this->delivery_id, $this->delivered_tip, $this->outcome->value);
    }
}
