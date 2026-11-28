<?php

declare(strict_types=1);

namespace App\Http\Windows;

use App\Asks\AskRecords;
use App\Asks\Data\AskInboxPaneData;
use App\Asks\Data\AskPreviewData;
use App\Models\Asks\Ask;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Values\PaneExcerpt;
use Illuminate\Http\Request;

final readonly class AskInboxWindowBuilder implements WindowBuilder
{
    public function __construct(private AskRecords $asks, private SurfaceAttributeMap $policies) {}

    public function build(Request $visit): AskInboxPaneData
    {
        $policy = $this->policies->forType(AskInboxPaneData::class);
        $asks = $this->asks->preview($policy->limitFor('items'));

        $items = array_values($asks->map(fn (Ask $ask) => AskPreviewData::build()
            ->id($ask->id)
            ->excerpt(PaneExcerpt::of($ask->body))
            ->isOpen($ask->open)
            ->finish())->all());

        return AskInboxPaneData::build()
            ->items($items)
            ->inboxUrl(route('web.asks', absolute: false))
            ->finish();
    }
}
