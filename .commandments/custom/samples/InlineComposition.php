<?php

declare(strict_types=1);

namespace App\Samples;

/**
 * A whole composed in place from three parts the method makes, which the inline-composition rule finds in a card and
 * outside the UI, beside the same wholes as classes of their own, which it passes.
 */
final class InlineCompositionOwner
{
    public function __construct(private readonly string $title) {}

    // @sin InlineCompositionDetector
    public function card(): SampleCard
    {
        return SampleCard::of(new SampleTitle($this->title), new SampleSubtitle('revision 1'), new SampleButton('Open'));
    }

    // @sin InlineCompositionDetector
    public function invoice(int $cents): SampleInvoice
    {
        return new SampleInvoice(new SampleLine('work', $cents), new SampleLine('travel', 0), new SampleTotal($cents));
    }

    // @righteous InlineCompositionDetector
    public function namedCard(): OwnerCard
    {
        return new OwnerCard($this->title);
    }
}

/**
 * The owner's card as a class of its own, which composes its own parts.
 */
final readonly class OwnerCard
{
    public SampleCard $card;

    public function __construct(string $title)
    {
        $this->card = SampleCard::of(new SampleTitle($title), new SampleSubtitle('revision 1'), new SampleButton('Open'));
    }
}

final readonly class SampleCard
{
    private function __construct(public SampleTitle $title, public SampleSubtitle $subtitle, public SampleButton $button) {}

    public static function of(SampleTitle $title, SampleSubtitle $subtitle, SampleButton $button): self
    {
        return new self($title, $subtitle, $button);
    }
}

final readonly class SampleTitle
{
    public function __construct(public string $text) {}
}

final readonly class SampleSubtitle
{
    public function __construct(public string $text) {}
}

final readonly class SampleButton
{
    public function __construct(public string $label) {}
}

final readonly class SampleInvoice
{
    public function __construct(public SampleLine $first, public SampleLine $second, public SampleTotal $total) {}
}

final readonly class SampleLine
{
    public function __construct(public string $label, public int $cents) {}
}

final readonly class SampleTotal
{
    public function __construct(public int $cents) {}
}
