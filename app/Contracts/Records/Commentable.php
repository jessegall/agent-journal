<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * A record users and agents may comment on. A record with text in versions also implements TextContent, so a comment
 * may point at an exact place in it; without it, comments are about the whole record.
 */
interface Commentable
{
    /**
     * @return MorphMany<covariant Model, covariant Model>
     */
    public function comments(): MorphMany;
}
