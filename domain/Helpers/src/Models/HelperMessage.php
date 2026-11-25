<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $helper_identity_id
 * @property string $text
 * @property string $suggested_command
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
#[Table('helper_messages')]
final class HelperMessage extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    public static function create(ActorReference $parent, HelperIdentity $helper, string $text, string $command): self
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
