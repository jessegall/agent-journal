<?php

declare(strict_types=1);

namespace App\Models\Chats;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
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

    /**
     * A pivot opens every attribute by default; this one takes only its Fillable list.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

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
