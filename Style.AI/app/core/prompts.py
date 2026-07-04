HAIRSTYLE_PROMPT = """
Use the second image as the hairstyle reference.

The hairstyle in the generated image must closely match the reference hairstyle.

Copy the hairstyle shape, silhouette, volume, length, texture, layering, hairline, side profile, top profile, fringe, curls, waves, fade, and styling details from the reference image.

The hairstyle should be immediately recognizable as the same hairstyle shown in the reference image.

Preserve only the person's identity, skin tone, facial features, age, and expression.

Do not preserve the original hairstyle.

Replace the original hairstyle completely with the reference hairstyle.

Photorealistic, professional salon photography, high detail, realistic hair strands, natural hairline, sharp focus.

"""

DRESS_TRY_ON_PROMPT = """
Use the first image as the person.

Use the second image as the saree reference.

Replace the person's current outfit completely with the saree from the reference image.

Preserve:
- face
- skin tone
- body shape
- pose
- hands
- background

Copy from the saree reference:
- fabric
- color
- pattern
- border design
- pleats
- draping style
- pallu style
- texture

The saree must fit naturally on the person's body with realistic folds and cloth physics.

Photorealistic, high detail, natural lighting, realistic fabric texture, professional fashion photography.
"""
