<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * The comments relation of a Commentable model: the comments on this record, oldest first.
 */
trait HasComments
{
    /**
     * @return MorphMany<Comment, $this>
     */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'target')->orderBy('id');
    }
}
