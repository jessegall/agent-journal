<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use App\Sharing\Enums\ShareState;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A public share of one root record: an agent's proposal, or the owner's grant with its bearer token kept as a
 * digest and as ciphertext for the owner alone, its gateway configuration version, its approved scope version and
 * its deadline. Neither token column is ever serialized.
 *
 * @property string $id
 * @property ShareState $state
 * @property string $root_type
 * @property string $root_id
 * @property string|null $owner_user_id
 * @property string|null $requesting_agent_id
 * @property string|null $requesting_session_id
 * @property string|null $share_gateway_configuration_id
 * @property int|null $configuration_version
 * @property int $scope_version
 * @property string|null $token_digest
 * @property string|null $token_ciphertext
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $terminal_at
 * @property int $pruned_allowed_reads
 * @property int $pruned_denied_reads
 * @property int $pruned_lifecycle_rows
 * @property CarbonImmutable|null $last_pruned_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['state', 'root_type', 'root_id', 'owner_user_id', 'configuration_version', 'scope_version', 'expires_at', 'terminal_at'])]
#[Hidden(['token_digest', 'token_ciphertext'])]
final class Share extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.share';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => ShareState::class,
            'configuration_version' => 'integer',
            'scope_version' => 'integer',
            'token_ciphertext' => 'encrypted',
            'expires_at' => 'immutable_datetime',
            'terminal_at' => 'immutable_datetime',
            'pruned_allowed_reads' => 'integer',
            'pruned_denied_reads' => 'integer',
            'pruned_lifecycle_rows' => 'integer',
            'last_pruned_at' => 'immutable_datetime',
        ];
    }

    /**
     * An agent's proposal to share the root: no token, no gateway, kept until the owner approves or it expires.
     */
    public static function propose(RecordIdentity $root, string $agentId, string $sessionId, CarbonImmutable $expiresAt): self
    {
        $share = self::forRoot($root, ShareState::Proposed, $expiresAt);
        $share->requesting_agent_id = $agentId;
        $share->requesting_session_id = $sessionId;
        $share->save();

        return $share;
    }

    /**
     * The owner's grant to share the root under a gateway configuration with a new token, waiting for its gateway.
     */
    public static function grant(RecordIdentity $root, string $ownerUserId, ShareGatewayConfiguration $configuration, ShareToken $token, CarbonImmutable $expiresAt): self
    {
        $share = self::forRoot($root, ShareState::Pending, $expiresAt);
        $share->owner_user_id = $ownerUserId;
        $share->share_gateway_configuration_id = $configuration->id;
        $share->configuration_version = $configuration->configuration_version;
        $share->token_digest = $token->digest;
        $share->token_ciphertext = $token->token;
        $share->save();

        return $share;
    }

    public function root(): RecordIdentity
    {
        return new RecordIdentity($this->root_type, $this->root_id);
    }

    /**
     * Whether one of these users granted the share; a proposal was granted by nobody.
     *
     * @param  list<string>  $userIds
     */
    public function isGrantedByOneOf(array $userIds): bool
    {
        return $this->owner_user_id !== null && in_array($this->owner_user_id, $userIds, true);
    }

    private static function forRoot(RecordIdentity $root, ShareState $state, CarbonImmutable $expiresAt): self
    {
        $share = new self;
        $share->state = $state;
        $share->root_type = $root->type;
        $share->root_id = $root->id;
        $share->scope_version = 0;
        $share->expires_at = $expiresAt;

        return $share;
    }
}
