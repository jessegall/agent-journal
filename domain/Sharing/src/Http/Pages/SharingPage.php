<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Pages;

use App\Http\Pages\Page;

/**
 * What the shares pages share, on top of what every page shares.
 */
abstract readonly class SharingPage extends Page {}
