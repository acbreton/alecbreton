varying vec3 vPosition;

uniform float uTime;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y += sin(modelPosition.x * 10.0) * (sin(uTime) * 0.1);
    modelPosition.z += sin(modelPosition.y * 7.0) * (cos(uTime) * 0.2);

    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Varyings
    vPosition = modelPosition.xyz;
}