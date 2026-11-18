<?php

declare(strict_types=1);

namespace Domain\Documents\Models\Concerns;

use App\Records\Support\RecordIdentity;
use App\Sharing\Support\ShareRelationSet;

/**
 * For a Documents record that can be shared with its comments, which its provider reads live as owned children.
 */
trait SharedWithComments
{
    public const string SHARED_COMMENTS = 'comments';

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::owned(self::SHARED_COMMENTS, 'share-comment');
    }
}
