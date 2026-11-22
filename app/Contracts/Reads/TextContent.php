<?php

declare(strict_types=1);

namespace App\Contracts\Reads;

use App\Exceptions\TextVersionUnavailable;
use App\Values\TextVersion;

/**
 * A record whose text can be read in versions, so a comment or a reader can point at an exact place in one version.
 * The owner supplies the text; Core slices, checks and shows it.
 */
interface TextContent
{
    /**
     * The current published version when none is named, otherwise exactly the named one.
     *
     * @throws TextVersionUnavailable when the named version does not exist or is not published
     */
    public function textVersion(string|null $version = null): TextVersion;
}
