<?php

declare(strict_types=1);

namespace App\Comments\Contracts;

use App\Comments\Resolvers\PublicComments;
use App\Comments\Support\PublicCommentPage;
use App\Records\Support\RecordIdentity;
use Illuminate\Container\Attributes\Bind;

/**
 * Reads the comments of a parent whose public disclosure the caller has already established, such as a shared
 * document's provider, a page at a time by written time and id. It asks no actor; it never reads another parent.
 */
#[Bind(PublicComments::class)]
interface PublicCommentResolver
{
    public const int LARGEST_PAGE = 100;

    public const int EXCERPT_CHARACTERS = 280;

    /**
     * @param  string|null  $after  where a previous page ended, null for the first page
     */
    public function pageOf(RecordIdentity $parent, int $limit, string|null $after): PublicCommentPage;
}
