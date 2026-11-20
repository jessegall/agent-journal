<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * Steering a parent gave a helper with no live job, kept with the exact command that would carry it: nothing is
 * launched for it.
 *
 * @property string $id
 * @property string $helper_identity_id
 * @property string $text
 * @property string $suggested_command
 */
#[Table('helper_messages')]
#[Fillable(['text', 'suggested_command'])]
final class HelperMessage extends Model implements ReadableModel
{
    use BelongsToOneActor, BoundedReads, HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    public static function keep(ActorIdentity $parent, HelperIdentity $helper, string $text, string $command): self
    {
        $message = new self();
        $message->helper_identity_id = $helper->id;
        $message->text = $text;
        $message->suggested_command = $command;
        $message->belongTo($parent);
        $message->save();

        return $message;
    }
}
