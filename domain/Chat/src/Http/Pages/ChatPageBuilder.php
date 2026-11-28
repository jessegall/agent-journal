<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Pages;

use App\Web\Creation\Contracts\PageBuilder;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Support\ChatReader;
use Illuminate\Http\Request;

final readonly class ChatPageBuilder implements PageBuilder
{
    public function __construct(private ChatReader $chat) {}

    public function build(Request $visit): ChatData
    {
        return $this->chat->fill($visit, ChatData::build())->finish();
    }
}
