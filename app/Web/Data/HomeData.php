<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Ui\Data\SlotSectionData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Home: the signed-in user's saved layouts, the windows the installed domains offer it in their declared order, and
 * the props of the sections in its bar.
 */
#[TypeScript]
final class HomeData extends Data
{
    /**
     * @param  list<LayoutData>  $layouts
     * @param  list<HomeWindowData>  $windows
     * @param  list<SlotSectionData>  $barSections
     */
    public function __construct(
        #[DataCollectionOf(LayoutData::class)]
        public readonly array $layouts,
        #[DataCollectionOf(HomeWindowData::class)]
        public readonly array $windows,
        #[DataCollectionOf(SlotSectionData::class)]
        public readonly array $barSections,
    ) {}
}
