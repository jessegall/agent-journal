<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * One user who may invite an agent into chats, under that agent's permission for one environment.
 *
 * @property string $id
 * @property string $permission_id
 * @property string $user_id
 */
#[Table('agent_chat_inviters')]
#[Fillable(['permission_id', 'user_id'])]
final class AgentChatInviter extends Pivot implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * The user as an inviter under the permission.
     */
    public static function create(string $permissionId, string $userId): self
    {
        $inviter = new self(['permission_id' => $permissionId, 'user_id' => $userId]);
        $inviter->save();

        return $inviter;
    }
}
