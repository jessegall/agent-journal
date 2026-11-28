<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Windows;

use App\Web\Creation\Contracts\WindowBuilder;
use Domain\Chat\Data\ChatWindowData;
use Domain\Chat\Support\ChatReader;
use Illuminate\Http\Request;

final readonly class ChatWindowBuilder implements WindowBuilder
{
    public function __construct(private ChatReader $chat) {}

    public function build(Request $visit): ChatWindowData
    {
        return $this->chat->fill($visit, ChatWindowData::build())->finish();
    }
}
