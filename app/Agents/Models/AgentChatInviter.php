<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One user who may invite an agent into chats, under that agent's permission for one environment.
 *
 * @property string $id
 * @property string $permission_id
 * @property string $user_id
 */
#[Fillable(['permission_id', 'user_id'])]
final class AgentChatInviter extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    // ----------[ Constructors ]----------

    /**
     * The user as an inviter under the permission, made once.
     */
    public static function admit(string $permissionId, string $userId): self
    {
        return self::query()->firstOrCreate(['permission_id' => $permissionId, 'user_id' => $userId]);
    }
}
