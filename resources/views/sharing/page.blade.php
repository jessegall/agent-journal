<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>{{ $page->title }}</title>
</head>
<body>
<main>
    <h1>{{ $page->title }}</h1>
    <article>{!! $bodyHtml !!}</article>
    @if ($page->linked !== [])
        <nav aria-label="Linked records">
            <ul>
                @foreach ($page->linked as $item)
                    <li>{{ $item->title }}</li>
                @endforeach
            </ul>
        </nav>
    @endif
    @if ($page->children !== [])
        <section aria-label="Comments">
            @foreach ($page->children as $item)
                <article>
                    @if ($item->quote !== null)
                        <blockquote>{{ $item->quote }}</blockquote>
                    @endif
                    <p>{{ $item->excerpt }}</p>
                </article>
            @endforeach
        </section>
    @endif
</main>
</body>
</html>
